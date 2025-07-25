import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// POST /api/ads/analytics - Record ad event (impression/click)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slotId, eventType, timestamp = new Date().toISOString() } = body

    // Validate required fields
    if (!slotId || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields: slotId, eventType' },
        { status: 400 }
      )
    }

    // Validate event type
    if (!['impression', 'click'].includes(eventType)) {
      return NextResponse.json(
        { error: 'Invalid event type. Must be "impression" or "click"' },
        { status: 400 }
      )
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => request.cookies.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            // This is a server-side API route, so we don't need to set cookies
          },
          remove: (name: string, options: any) => {
            // This is a server-side API route, so we don't need to remove cookies
          },
        },
      }
    )

    // Insert analytics event
    const { data, error } = await supabase
      .from('ad_analytics')
      .insert({
        slot_id: slotId,
        event_type: eventType,
        timestamp: timestamp,
        // Note: We don't store any PII (user IDs, IPs, etc.) for privacy compliance
      })

    if (error) {
      console.error('Error inserting ad analytics:', error)
      return NextResponse.json(
        { error: 'Failed to record analytics event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/ads/analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/ads/analytics - Retrieve analytics data
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => request.cookies.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            // This is a server-side API route, so we don't need to set cookies
          },
          remove: (name: string, options: any) => {
            // This is a server-side API route, so we don't need to remove cookies
          },
        },
      }
    )
    
    // Check admin access by getting the session
    const { data: { session } } = await supabase.auth.getSession()
    console.log('API Session:', session?.user?.id, session?.user?.email)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const slotId = searchParams.get('slotId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const eventType = searchParams.get('eventType')

    // Build query
    let query = supabase
      .from('ad_analytics')
      .select('*')

    // Apply filters
    if (slotId) {
      query = query.eq('slot_id', slotId)
    }

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (from) {
      query = query.gte('timestamp', from)
    }

    if (to) {
      query = query.lte('timestamp', to)
    }

    // Order by timestamp descending
    query = query.order('timestamp', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching ad analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch analytics data' },
        { status: 500 }
      )
    }

    // Aggregate data for summary
    const summary = {
      totalEvents: data?.length || 0,
      impressions: data?.filter((event: any) => event.event_type === 'impression').length || 0,
      clicks: data?.filter((event: any) => event.event_type === 'click').length || 0,
      ctr: 0,
      bySlot: {} as Record<string, any>
    }

    // Calculate CTR
    if (summary.impressions > 0) {
      summary.ctr = (summary.clicks / summary.impressions) * 100
    }

    // Group by slot
    if (data) {
      data.forEach((event: any) => {
        if (!summary.bySlot[event.slot_id]) {
          summary.bySlot[event.slot_id] = {
            impressions: 0,
            clicks: 0,
            ctr: 0
          }
        }
        
        if (event.event_type === 'impression') {
          summary.bySlot[event.slot_id].impressions++
        } else if (event.event_type === 'click') {
          summary.bySlot[event.slot_id].clicks++
        }
      })

      // Calculate CTR for each slot
      Object.keys(summary.bySlot).forEach(slotId => {
        const slot = summary.bySlot[slotId]
        if (slot.impressions > 0) {
          slot.ctr = (slot.clicks / slot.impressions) * 100
        }
      })
    }

    return NextResponse.json({
      data,
      summary,
      filters: { slotId, from, to, eventType }
    })
  } catch (error) {
    console.error('Error in GET /api/ads/analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 