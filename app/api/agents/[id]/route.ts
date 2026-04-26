import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'edge';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: agent, error: fetchError } = await supabase
      .from('agents')
      .select('id, user_id, name, container_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !agent) {
      return NextResponse.json({ error: 'Agent not found.' }, { status: 404 });
    }

    if (agent.container_id) {
      const coolifyUrl = process.env.CLICKRUNCLAW_COOLIFY_URL?.replace(/\/$/, '');
      const coolifyToken = process.env.CLICKRUNCLAW_COOLIFY_TOKEN;

      if (coolifyUrl && coolifyToken) {
        try {
          await fetch(`${coolifyUrl}/api/v1/services/${agent.container_id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${coolifyToken}`,
              Accept: 'application/json',
            },
            cache: 'no-store',
          });
        } catch (error) {
          console.error('Coolify delete failed:', error);
        }
      }
    }

    const { error: deleteError } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete agent.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Agent deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Delete failed.' }, { status: 500 });
  }
}
