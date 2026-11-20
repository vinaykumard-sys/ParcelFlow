// ============================================================================
// PARCELFLOW ONBOARDING SERVICE (src/services/onboardingService.ts)
// End-to-end 8-stage society onboarding pipeline:
// Society -> Towers -> Apartments -> Residents -> Staff -> Storage -> Pickup Slots -> Activation
// ============================================================================

import { supabase } from './supabaseClient.ts';
import { logAuditEvent } from './auditService.ts';
import { updateSocietySubscription } from './subscriptionService.ts';

export interface OnboardingSocietyData {
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  totalTowers: number;
  totalFlats: number;
  hubPhone?: string;
  hubOperatingHours?: string;
}

export interface OnboardingTowerData {
  name: string;
  floors: number;
  flatsPerFloor: number;
}

export interface OnboardingApartmentData {
  tower: string;
  floor: number;
  unitNumber: string;
}

export interface OnboardingResidentData {
  fullName: string;
  email: string;
  phone: string;
  tower: string;
  flatNumber: string;
  emergencyContact?: string;
}

export interface OnboardingStaffData {
  fullName: string;
  phone: string;
  email?: string;
  badgeNumber: string;
  designation: string;
  shift: string;
}

export interface OnboardingStorageData {
  zone: string;
  rack: string;
  shelvesCount: number;
  compartmentType: 'SMALL' | 'MEDIUM' | 'LARGE' | 'OVERSIZE' | 'COLD_STORAGE';
}

export interface OnboardingPickupSlotData {
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

export interface CompleteOnboardingPayload {
  society: OnboardingSocietyData;
  towers: OnboardingTowerData[];
  apartments: OnboardingApartmentData[];
  residents: OnboardingResidentData[];
  staff: OnboardingStaffData[];
  storage: OnboardingStorageData[];
  pickupSlots: OnboardingPickupSlotData[];
  selectedPlan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  adminUserId?: string;
}

export interface OnboardingResult {
  success: boolean;
  societyId?: string;
  summary?: {
    societyName: string;
    societyCode: string;
    towersCount: number;
    apartmentsCount: number;
    residentsCount: number;
    staffCount: number;
    storageSlotsCount: number;
    pickupSlotsCount: number;
    plan: string;
    activatedAt: string;
  };
  error?: string;
}

/**
 * Execute atomic or staged society onboarding
 */
export async function executeSocietyOnboarding(
  payload: CompleteOnboardingPayload
): Promise<OnboardingResult> {
  try {
    const { society, towers, apartments, residents, staff, storage, pickupSlots, selectedPlan, adminUserId } = payload;

    if (!society.name?.trim() || !society.code?.trim() || !society.city?.trim()) {
      return { success: false, error: 'Society Name, Unique Code, and City are required.' };
    }

    const now = new Date().toISOString();
    const cleanCode = society.code.trim().toUpperCase();

    // Stage 1: Create Society
    const { data: createdSociety, error: socError } = await supabase
      .from('societies')
      .upsert(
        [
          {
            name: society.name.trim(),
            code: cleanCode,
            address: society.address.trim(),
            city: society.city.trim(),
            state: society.state.trim() || 'Karnataka',
            postal_code: society.postalCode.trim() || '560001',
            total_towers: towers.length || society.totalTowers || 1,
            total_flats: apartments.length || society.totalFlats || 0,
            hub_phone: society.hubPhone || '+91 80 4433 2211',
            hub_operating_hours: society.hubOperatingHours || '07:00 AM - 11:00 PM',
            is_active: true,
            created_at: now,
            updated_at: now,
          },
        ],
        { onConflict: 'code' }
      )
      .select()
      .single();

    if (socError || !createdSociety) {
      return { success: false, error: `Failed to create society record: ${socError?.message}` };
    }

    const societyId = createdSociety.id;

    // Stage 2 & 3: Provision Apartments across towers
    const apartmentInserts = apartments.map((apt) => ({
      society_id: societyId,
      tower: apt.tower,
      floor: apt.floor,
      unit_number: apt.unitNumber,
      is_active: true,
      created_at: now,
      updated_at: now,
    }));

    if (apartmentInserts.length > 0) {
      const { error: aptError } = await supabase
        .from('apartments')
        .upsert(apartmentInserts, { onConflict: 'society_id,tower,unit_number' });

      if (aptError) {
        console.warn('Apartment provisioning notice:', aptError.message);
      }
    }

    // Fetch created apartments to map IDs
    const { data: dbApartments } = await supabase
      .from('apartments')
      .select('id, tower, unit_number')
      .eq('society_id', societyId);

    const aptMap = new Map<string, string>();
    if (dbApartments) {
      dbApartments.forEach((a) => {
        aptMap.set(`${a.tower}_${a.unit_number}`, a.id);
      });
    }

    // Stage 4: Provision Residents
    for (const res of residents) {
      try {
        const aptId = aptMap.get(`${res.tower}_${res.flatNumber}`);
        const cleanPhone = res.phone.replace(/\D/g, '');

        // 1. Create or get user
        const { data: userRec } = await supabase
          .from('users')
          .upsert(
            [
              {
                full_name: res.fullName,
                phone: `+91 ${cleanPhone}`,
                email: res.email || `${cleanPhone}@${cleanCode.toLowerCase()}.org`,
                role: 'RESIDENT',
                is_active: true,
                created_at: now,
                updated_at: now,
              },
            ],
            { onConflict: 'phone' }
          )
          .select()
          .single();

        if (userRec && aptId) {
          await supabase.from('residents').upsert(
            [
              {
                user_id: userRec.id,
                society_id: societyId,
                apartment_id: aptId,
                is_primary: true,
                emergency_contact: res.emergencyContact || null,
                created_at: now,
                updated_at: now,
              },
            ],
            { onConflict: 'user_id,society_id' }
          );
        }
      } catch (rErr) {
        console.warn('Resident provisioning skip:', rErr);
      }
    }

    // Stage 5: Provision Staff Roster
    for (const stf of staff) {
      try {
        const cleanPhone = stf.phone.replace(/\D/g, '');
        const { data: userRec } = await supabase
          .from('users')
          .upsert(
            [
              {
                full_name: stf.fullName,
                phone: `+91 ${cleanPhone}`,
                email: stf.email || `${stf.badgeNumber.toLowerCase()}@${cleanCode.toLowerCase()}.org`,
                role: 'STAFF',
                is_active: true,
                created_at: now,
                updated_at: now,
              },
            ],
            { onConflict: 'phone' }
          )
          .select()
          .single();

        if (userRec) {
          await supabase.from('staff').upsert(
            [
              {
                user_id: userRec.id,
                society_id: societyId,
                badge_number: stf.badgeNumber.toUpperCase(),
                designation: stf.designation,
                shift: stf.shift,
                is_active: true,
                created_at: now,
                updated_at: now,
              },
            ],
            { onConflict: 'society_id,badge_number' }
          );

          await logAuditEvent({
            societyId,
            userId: adminUserId,
            action: 'STAFF_CREATED',
            entityType: 'staff',
            entityId: userRec.id,
            payload: { badge: stf.badgeNumber, designation: stf.designation, name: stf.fullName },
          });
        }
      } catch (sErr) {
        console.warn('Staff provisioning skip:', sErr);
      }
    }

    // Stage 6: Provision Storage Slots
    const storageInserts: any[] = [];
    storage.forEach((st) => {
      for (let i = 1; i <= st.shelvesCount; i++) {
        const shelfCode = `Slot ${i.toString().padStart(2, '0')}`;
        storageInserts.push({
          society_id: societyId,
          zone: st.zone || 'Express Delivery Hub',
          rack: st.rack,
          shelf: shelfCode,
          compartment_type: st.compartmentType || 'MEDIUM',
          is_occupied: false,
          current_parcel_id: null,
          created_at: now,
          updated_at: now,
        });
      }
    });

    if (storageInserts.length > 0) {
      await supabase
        .from('storage_locations')
        .upsert(storageInserts, { onConflict: 'society_id,rack,shelf' });
    }

    // Stage 7: Provision Evening Pickup Slots
    const todayDate = new Date().toISOString().split('T')[0];
    const slotInserts = pickupSlots.map((ps) => ({
      society_id: societyId,
      slot_date: todayDate,
      start_time: ps.startTime,
      end_time: ps.endTime,
      max_capacity: ps.maxCapacity || 25,
      current_bookings_count: 0,
      status: 'AVAILABLE',
      created_at: now,
      updated_at: now,
    }));

    if (slotInserts.length > 0) {
      await supabase.from('pickup_slots').insert(slotInserts);
    }

    // Stage 8: Assign Subscription Plan & Activate Society
    await updateSocietySubscription({
      societyId,
      plan: selectedPlan,
      billingCycle: 'MONTHLY',
      actorUserId: adminUserId,
    });

    await logAuditEvent({
      societyId,
      userId: adminUserId,
      action: 'ROLE_CHANGED',
      entityType: 'societies',
      entityId: societyId,
      payload: { action: 'SOCIETY_ONBOARDED_ACTIVATED', plan: selectedPlan, code: cleanCode },
    });

    return {
      success: true,
      societyId,
      summary: {
        societyName: society.name,
        societyCode: cleanCode,
        towersCount: towers.length,
        apartmentsCount: apartments.length,
        residentsCount: residents.length,
        staffCount: staff.length,
        storageSlotsCount: storageInserts.length,
        pickupSlotsCount: pickupSlots.length,
        plan: selectedPlan,
        activatedAt: now,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Onboarding execution failed' };
  }
}

export const onboardingService = {
  executeSocietyOnboarding,
};
