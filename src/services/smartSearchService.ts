// ============================================================================
// PARCELFLOW SMART SEARCH SERVICE (src/services/smartSearchService.ts)
// Multi-factor search across parcels, orders, incidents, tracking numbers,
// carriers, status, date, and flat with category filter tabs and natural language parsing.
// ============================================================================

import { supabase } from './supabaseClient.ts';
import type {
  SmartSearchFilter,
  SmartSearchResultItem,
  SmartSearchCategory,
  EnrichedParcel,
} from './types.ts';
import { getResidentParcels } from './parcelService.ts';

/**
 * Recognised couriers for natural language extraction
 */
const KNOWN_CARRIERS = ['AMAZON', 'FLIPKART', 'BLUEDART', 'DELHIVERY', 'DTDC', 'FEDEX', 'MYNTRA', 'SWIGGY', 'ZOMATO', 'EKART'];

/**
 * Parses freeform natural language query into search facets
 */
export function parseSearchQuery(rawQuery: string): {
  cleanQuery: string;
  detectedCarrier?: string;
  detectedFlat?: string;
  detectedDate?: string;
} {
  const text = (rawQuery || '').trim();
  let cleanQuery = text;
  let detectedCarrier: string | undefined;
  let detectedFlat: string | undefined;
  let detectedDate: string | undefined;

  const words = text.split(/\s+/);
  for (const word of words) {
    const upper = word.toUpperCase();
    if (KNOWN_CARRIERS.includes(upper)) {
      detectedCarrier = upper;
    }
    // Check for flat patterns like "T1-402", "B-204", "402", "Flat 402"
    if (/^(?:[A-Za-z]-?)?\d{3,4}$/.test(word) && !detectedCarrier?.includes(word)) {
      detectedFlat = word;
    }
    if (['TODAY', 'YESTERDAY', 'WEEK'].includes(upper)) {
      detectedDate = upper;
    }
  }

  return { cleanQuery, detectedCarrier, detectedFlat, detectedDate };
}

/**
 * Multi-factor search across parcels, orders, and incidents
 */
export async function executeSmartSearch(filter: SmartSearchFilter): Promise<SmartSearchResultItem[]> {
  const query = (filter.query || '').trim().toLowerCase();
  const category: SmartSearchCategory = filter.category || 'ALL';
  const societyId = filter.societyId;
  const residentId = filter.residentId;

  const results: SmartSearchResultItem[] = [];

  try {
    // 1. Fetch Parcels matching criteria
    if (category === 'ALL' || category === 'PARCELS') {
      let parcelQuery = supabase
        .from('parcels')
        .select(`
          *,
          apartments (tower, unit_number),
          storage_locations (zone, rack, shelf)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (societyId) {
        parcelQuery = parcelQuery.eq('society_id', societyId);
      }
      if (residentId) {
        parcelQuery = parcelQuery.eq('resident_id', residentId);
      }
      if (filter.carrier) {
        parcelQuery = parcelQuery.ilike('carrier_name', `%${filter.carrier}%`);
      }
      if (filter.status) {
        parcelQuery = parcelQuery.eq('status', filter.status);
      }

      const { data: parcels, error: pErr } = await parcelQuery;

      if (!pErr && parcels && parcels.length > 0) {
        for (const p of parcels) {
          const tracking = (p.tracking_number || '').toLowerCase();
          const courier = (p.carrier_name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          const unit = (p.apartments?.unit_number || '').toLowerCase();
          const tower = (p.apartments?.tower || '').toLowerCase();
          const flatStr = `${tower}-${unit}`.toLowerCase();
          const rackStr = p.storage_locations ? `${p.storage_locations.rack}-${p.storage_locations.shelf}` : '';

          const matchesQuery =
            !query ||
            tracking.includes(query) ||
            courier.includes(query) ||
            desc.includes(query) ||
            unit.includes(query) ||
            flatStr.includes(query) ||
            rackStr.toLowerCase().includes(query);

          if (matchesQuery) {
            results.push({
              id: p.id,
              type: 'PARCEL',
              title: `${p.carrier_name || 'Parcel'} #${p.tracking_number}`,
              subtitle: p.description || `Parcel for Flat ${p.apartments?.tower || ''}-${p.apartments?.unit_number || ''}`,
              status: p.status,
              statusBadgeColor: getStatusBadgeColor(p.status),
              date: p.created_at,
              tracking_number: p.tracking_number,
              carrier: p.carrier_name,
              flat: p.apartments ? `${p.apartments.tower}-${p.apartments.unit_number}` : undefined,
              storage_location: p.storage_locations ? `Hub ${p.storage_locations.zone || 'A'} - ${p.storage_locations.rack}${p.storage_locations.shelf}` : undefined,
              highlightSnippet: `Received: ${new Date(p.created_at).toLocaleDateString()}`,
              raw: p,
            });
          }
        }
      } else if (residentId) {
        // Fallback to local resident parcels if database is in offline / fallback state
        const fallbackList = await getResidentParcels(residentId);
        for (const p of fallbackList) {
          const tracking = (p.tracking_number || '').toLowerCase();
          const courier = (p.carrier_name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          if (!query || tracking.includes(query) || courier.includes(query) || desc.includes(query)) {
            results.push({
              id: p.id,
              type: 'PARCEL',
              title: `${p.carrier_name} #${p.tracking_number}`,
              subtitle: p.description || 'Inbound delivery',
              status: p.status,
              statusBadgeColor: getStatusBadgeColor(p.status),
              date: p.created_at,
              tracking_number: p.tracking_number,
              carrier: p.carrier_name,
              storage_location: p.storage_location ? `Hub ${p.storage_location.zone} - ${p.storage_location.rack}${p.storage_location.shelf}` : undefined,
              raw: p,
            });
          }
        }
      }
    }

    // 2. Fetch Orders (Shopping Sync) matching criteria
    if (category === 'ALL' || category === 'ORDERS') {
      try {
        const { data: shoppingParcels } = await supabase
          .from('parcels')
          .select('*')
          .not('synced_from_provider', 'is', null)
          .order('created_at', { ascending: false })
          .limit(30);

        if (shoppingParcels) {
          for (const s of shoppingParcels) {
            const tracking = (s.tracking_number || '').toLowerCase();
            const provider = (s.synced_from_provider || s.carrier_name || '').toLowerCase();
            const desc = (s.description || '').toLowerCase();

            if (!query || tracking.includes(query) || provider.includes(query) || desc.includes(query)) {
              results.push({
                id: s.id,
                type: 'ORDER',
                title: `${s.synced_from_provider || s.carrier_name} Order`,
                subtitle: s.description || `Tracking: ${s.tracking_number}`,
                status: s.status,
                statusBadgeColor: '#3B82F6',
                date: s.created_at,
                tracking_number: s.tracking_number,
                carrier: s.carrier_name || s.synced_from_provider,
                raw: s,
              });
            }
          }
        }
      } catch (err) {
        // Orders sync optional
      }
    }

    // 3. Fetch Incidents matching criteria
    if (category === 'ALL' || category === 'INCIDENTS') {
      try {
        let incidentQuery = supabase
          .from('parcel_incidents')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (societyId) {
          incidentQuery = incidentQuery.eq('society_id', societyId);
        }

        const { data: incidents } = await incidentQuery;
        if (incidents) {
          for (const inc of incidents) {
            const desc = (inc.description || '').toLowerCase();
            const issue = (inc.issue_type || '').toLowerCase();
            if (!query || desc.includes(query) || issue.includes(query)) {
              results.push({
                id: inc.id,
                type: 'INCIDENT',
                title: `Incident: ${formatIssueType(inc.issue_type)}`,
                subtitle: inc.description,
                status: inc.status,
                statusBadgeColor: inc.status === 'RESOLVED' ? '#10B981' : '#EF4444',
                date: inc.created_at,
                raw: inc,
              });
            }
          }
        }
      } catch (err) {
        // Incidents optional
      }
    }
  } catch (globalErr) {
    console.error('Smart search encountered error:', globalErr);
  }

  // Sort: most recent first
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return results;
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'READY_FOR_PICKUP':
    case 'READY':
      return '#10B981'; // Green
    case 'STORED':
      return '#8B5CF6'; // Purple
    case 'RECEIVED':
    case 'WAITING':
      return '#3B82F6'; // Blue
    case 'COMPLETED':
    case 'HANDED_OVER':
      return '#6B7280'; // Gray
    case 'CANCELLED':
    case 'EXPIRED':
      return '#EF4444'; // Red
    default:
      return '#F59E0B'; // Amber
  }
}

function formatIssueType(issue: string): string {
  return (issue || '')
    .split('_')
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}
