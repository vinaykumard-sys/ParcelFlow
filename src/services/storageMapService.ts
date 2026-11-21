// ============================================================================
// PARCELFLOW STORAGE MAP SERVICE (src/services/storageMapService.ts)
// 2D Interactive Storage Grid (Hub Alpha/Beta, Racks A-D x Shelves 1-5),
// live slot occupancy, resident parcel highlight, capacity calculations,
// and smart storage suggestion algorithm based on parcel dimensions & proximity.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type {
  StorageGridSlot,
  StorageGridStats,
  StorageSuggestion,
  StorageCompartmentType,
  Parcel,
} from './types.ts';
import { recordCustodyEvent } from './chainOfCustodyService.ts';

const RACKS = ['A', 'B', 'C', 'D'];
const SHELVES = ['1', '2', '3', '4', '5'];
const HUBS = ['Hub Alpha', 'Hub Beta'];

/**
 * Generate default slot ID and label
 */
export function getSlotLabel(hub: string, rack: string, shelf: string): string {
  const hubPrefix = hub.toLowerCase().includes('beta') ? 'Hub B' : 'Hub A';
  return `${hubPrefix} - ${rack}${shelf}`;
}

/**
 * Determines natural compartment type based on rack/shelf placement
 * Lower shelves (1, 2) = LARGE (heavy packages, waist/floor level)
 * Mid shelves (3) = MEDIUM (standard eye-level packages)
 * Top shelves (4, 5) = SMALL (lightweight envelopes & packets)
 */
export function getNaturalCompartmentType(shelf: string): StorageCompartmentType {
  const s = parseInt(shelf, 10);
  if (s <= 2) return 'LARGE';
  if (s === 3) return 'MEDIUM';
  return 'SMALL';
}

/**
 * Fetch 2D grid slots and occupancy for a hub (or all hubs)
 * Optionally highlights parcels belonging to the viewing resident
 */
export async function getStorageGrid(
  hubId?: string,
  residentParcelIds?: string[]
): Promise<{
  slots: StorageGridSlot[];
  stats: StorageGridStats;
}> {
  const residentSet = new Set(residentParcelIds || []);

  // 1. Fetch real storage_locations from Supabase if available
  let dbLocations: any[] = [];
  try {
    const { data, error } = await supabase
      .from('storage_locations')
      .select('*, parcels:current_parcel_id (*)')
      .order('rack', { ascending: true })
      .order('shelf', { ascending: true });

    if (!error && data && data.length > 0) {
      dbLocations = data;
    }
  } catch (err) {
    console.warn('Storage locations query warning:', err);
  }

  const locationMap = new Map<string, any>();
  for (const loc of dbLocations) {
    const hubName = loc.zone?.toLowerCase().includes('beta') || loc.zone === 'B' ? 'Hub Beta' : 'Hub Alpha';
    const key = `${hubName}-${loc.rack}-${loc.shelf}`;
    locationMap.set(key, loc);
  }

  const allSlots: StorageGridSlot[] = [];
  let totalCount = 0;
  let occupiedCount = 0;
  const hubAlphaCount = { total: 0, occupied: 0, available: 0 };
  const hubBetaCount = { total: 0, occupied: 0, available: 0 };

  const targetHubs = hubId
    ? HUBS.filter(h => h.toLowerCase() === hubId.toLowerCase() || (hubId.includes('Alpha') && h.includes('Alpha')) || (hubId.includes('Beta') && h.includes('Beta')))
    : HUBS;

  for (const hub of targetHubs) {
    for (const rack of RACKS) {
      for (const shelf of SHELVES) {
        const key = `${hub}-${rack}-${shelf}`;
        const dbLoc = locationMap.get(key);
        const slotId = dbLoc?.id || `loc-${hub.replace(/\s+/g, '-').toLowerCase()}-${rack}-${shelf}`;
        const isOccupied = dbLoc ? Boolean(dbLoc.is_occupied) : false;
        const parcelId = dbLoc?.current_parcel_id || null;
        const parcel = dbLoc?.parcels || null;
        const isResident = parcelId ? residentSet.has(parcelId) : false;
        const compType = (dbLoc?.compartment_type as StorageCompartmentType) || getNaturalCompartmentType(shelf);

        const slot: StorageGridSlot = {
          id: slotId,
          hub,
          rack,
          shelf,
          label: getSlotLabel(hub, rack, shelf),
          compartment_type: compType,
          is_occupied: isOccupied,
          parcel_id: parcelId,
          parcel,
          is_resident_parcel: isResident,
        };

        allSlots.push(slot);
        totalCount++;
        if (isOccupied) occupiedCount++;

        if (hub === 'Hub Alpha') {
          hubAlphaCount.total++;
          if (isOccupied) hubAlphaCount.occupied++;
          else hubAlphaCount.available++;
        } else {
          hubBetaCount.total++;
          if (isOccupied) hubBetaCount.occupied++;
          else hubBetaCount.available++;
        }
      }
    }
  }

  const stats: StorageGridStats = {
    totalSlots: totalCount,
    occupiedSlots: occupiedCount,
    availableSlots: totalCount - occupiedCount,
    occupancyRate: totalCount > 0 ? Math.round((occupiedCount / totalCount) * 100) : 0,
    hubAlpha: hubAlphaCount,
    hubBeta: hubBetaCount,
  };

  return { slots: allSlots, stats };
}

/**
 * Smart Storage Suggestion Algorithm
 * Evaluates parcel size (SMALL / MEDIUM / LARGE), available slot proximity,
 * ergonomic shelf placement (waist height shelf 3 for frequent access, lower shelves 1-2 for heavy/large items),
 * and current rack space utilization.
 */
export async function getSuggestedSlot(
  parcelSize: 'SMALL' | 'MEDIUM' | 'LARGE' = 'MEDIUM',
  options?: { preferredHub?: string; proximityFlat?: string }
): Promise<StorageSuggestion> {
  const { slots, stats } = await getStorageGrid(options?.preferredHub);
  const availableSlots = slots.filter(s => !s.is_occupied);

  if (availableSlots.length === 0) {
    // Graceful fallback when completely full
    return {
      recommendedSlot: {
        hub: options?.preferredHub || 'Hub Alpha',
        rack: 'A',
        shelf: '1',
        label: `${options?.preferredHub || 'Hub Alpha'} - Overflow Area`,
        compartment_type: 'OVERSIZE',
      },
      reason: 'Hub currently at 100% capacity. Assigned to overflow staging area.',
      spaceUtilizationPercent: 100,
      proximityScore: 90,
      alternativeSlots: [],
    };
  }

  // Score available slots based on ergonomics, size fit, and pickup proximity
  // 1. Shelf score:
  //    - LARGE: prefer Shelf 1 or 2 (ground level for heavy parcels)
  //    - MEDIUM: prefer Shelf 2 or 3 (chest/waist level for easiest grab)
  //    - SMALL: prefer Shelf 3, 4, or 5 (upper shelves)
  // 2. Rack score:
  //    - Rack A is closest to reception counter (Proximity Score = 95)
  //    - Rack B = 85, Rack C = 75, Rack D = 65
  const scoredSlots = availableSlots.map(slot => {
    let score = 50;
    const shelfNum = parseInt(slot.shelf, 10);

    // Ergonomic size matching
    if (parcelSize === 'LARGE') {
      if (shelfNum === 1) score += 40;
      else if (shelfNum === 2) score += 30;
      else if (shelfNum === 3) score += 10;
      else score -= 20; // Bad idea to put large heavy boxes on top shelf
    } else if (parcelSize === 'MEDIUM') {
      if (shelfNum === 3) score += 40; // Perfect waist height
      else if (shelfNum === 2) score += 30;
      else if (shelfNum === 4) score += 20;
      else score += 10;
    } else {
      // SMALL
      if (shelfNum === 4 || shelfNum === 5) score += 40; // Ideal use of upper shelves
      else if (shelfNum === 3) score += 25;
      else score += 10;
    }

    // Proximity to counter
    if (slot.rack === 'A') score += 20;
    else if (slot.rack === 'B') score += 15;
    else if (slot.rack === 'C') score += 10;
    else score += 5;

    // Prefer Hub Alpha if not specified
    if (slot.hub.includes('Alpha')) score += 5;

    return { slot, score };
  });

  scoredSlots.sort((a, b) => b.score - a.score);
  const best = scoredSlots[0].slot;

  let reason = '';
  if (parcelSize === 'LARGE') {
    reason = `Lower tier shelf ${best.shelf} in Rack ${best.rack} optimized for heavy weight & easy retrieval without strain.`;
  } else if (parcelSize === 'SMALL') {
    reason = `Top tier shelf ${best.shelf} in Rack ${best.rack} efficiently saves floor and waist space for envelopes & small parcels.`;
  } else {
    reason = `Waist-height Shelf ${best.shelf} in Rack ${best.rack} provides quick 10-second handover proximity to the security desk.`;
  }

  const alternatives = scoredSlots.slice(1, 4).map(s => ({
    hub: s.slot.hub,
    rack: s.slot.rack,
    shelf: s.slot.shelf,
    label: s.slot.label,
  }));

  return {
    recommendedSlot: {
      hub: best.hub,
      rack: best.rack,
      shelf: best.shelf,
      label: best.label,
      compartment_type: best.compartment_type,
    },
    reason,
    spaceUtilizationPercent: stats.occupancyRate,
    proximityScore: Math.min(98, 70 + scoredSlots[0].score / 3),
    alternativeSlots: alternatives,
  };
}

/**
 * Assign a parcel to a storage slot in Supabase, updating status and creating a custody event
 */
export async function assignSlot(
  parcelId: string,
  slotIdOrLabel: string,
  staffInfo?: { staffId?: string; staffName?: string; societyId?: string }
): Promise<{ success: boolean; message: string; slotLabel?: string }> {
  try {
    // 1. Resolve storage location ID
    let locationId = slotIdOrLabel;
    let slotLabel = slotIdOrLabel;

    // If slotIdOrLabel is formatted like "loc-hub-alpha-b-3" or label "Hub A - B3"
    const { data: existingLoc } = await supabase
      .from('storage_locations')
      .select('id, rack, shelf, zone')
      .or(`id.eq.${slotIdOrLabel},rack.eq.${slotIdOrLabel.slice(-2, -1)}`)
      .maybeSingle();

    if (existingLoc) {
      locationId = existingLoc.id;
      slotLabel = `Hub ${existingLoc.zone || 'A'} - ${existingLoc.rack}${existingLoc.shelf}`;
    }

    // 2. Update parcel in database
    const { error: pErr } = await supabase
      .from('parcels')
      .update({
        storage_location_id: locationId.startsWith('loc-') ? null : locationId,
        status: 'STORED',
        updated_at: new Date().toISOString(),
      })
      .eq('id', parcelId);

    if (pErr) {
      console.warn('Parcel update storage location note:', pErr.message);
    }

    // 3. Mark location as occupied
    if (!locationId.startsWith('loc-')) {
      await supabase
        .from('storage_locations')
        .update({
          is_occupied: true,
          current_parcel_id: parcelId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', locationId);
    }

    // 4. Record digital chain of custody timeline event
    await recordCustodyEvent({
      parcel_id: parcelId,
      stage: 'STORAGE_ASSIGNED',
      title: 'Storage Slot Assigned',
      description: `Parcel secured at slot ${slotLabel}`,
      actor_name: staffInfo?.staffName || 'Security Team',
      actor_role: 'SECURITY',
      location: slotLabel,
      verification_method: 'MANUAL',
    });

    return {
      success: true,
      message: `Parcel successfully assigned to ${slotLabel}`,
      slotLabel,
    };
  } catch (err: any) {
    console.error('Error assigning slot:', err);
    return {
      success: false,
      message: err.message || 'Failed to assign storage slot',
    };
  }
}
