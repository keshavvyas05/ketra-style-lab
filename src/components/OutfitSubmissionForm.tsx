
import React, { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from "react-router-dom";

interface OutfitSubmissionFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const OutfitSubmissionForm: React.FC<OutfitSubmissionFormProps> = ({ onClose, onSuccess }) => {
  const [instagramId, setInstagramId] = useState('');
  const [caption, setCaption] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { weekNumber, year } = useMemo(() => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    const year = now.getFullYear();
    return { weekNumber, year };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to submit an outfit.',
        variant: 'destructive',
      });
      navigate("/auth");
      return;
    }

    if (!photo) {
      toast({
        title: 'Error',
        description: 'Please upload a photo.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Check for existing submission
      const { data: existingSubmission, error: checkError } = await supabase
        .from('outfit_submissions')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .eq('year', year);

      if (checkError) throw checkError;

      if (existingSubmission && existingSubmission.length > 0) {
        const msg = "You have already submitted an outfit this week. Come back next Monday!";
        setSubmitError(msg);
        toast({ title: "Already submitted", description: msg, variant: "destructive" });
        return;
      }

      // Upload photo to Supabase storage
      const fileExt = photo.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('outfit-photos')
        .upload(filePath, photo);

      if (uploadError) throw uploadError;

      const photo_url = `${supabase.storage.from('outfit-photos').getPublicUrl(filePath).data.publicUrl}`;

      // Save submission to Supabase
      const { error: insertError } = await supabase
        .from('outfit_submissions')
        .insert({
          user_id: user.id,
          photo_url,
          instagram_id: instagramId,
          caption,
          week_number: weekNumber,
          year,
          submission_type: 'real_photo',
        });

      if (insertError) throw insertError;

      toast({
        title: 'Success',
        description: 'Your outfit has been submitted!',
      });
      setLoading(false);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setSubmitError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto max-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="instagramId">Instagram ID</Label>
          <Input
            id="instagramId"
            type="text"
            placeholder="@yourusername"
            value={instagramId}
            onChange={(e) => setInstagramId(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="photo">Outfit Photo</Label>
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            required
          />
        </div>
        <div>
          <Label htmlFor="caption">Caption (Optional)</Label>
          <Textarea
            id="caption"
            placeholder="Describe your outfit..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Outfit'}
        </Button>
        {submitError && (
          <p className="text-sm text-red-400 font-body text-center">
            {submitError}
          </p>
        )}
      </form>
    </div>
  );
};

export default OutfitSubmissionForm;
