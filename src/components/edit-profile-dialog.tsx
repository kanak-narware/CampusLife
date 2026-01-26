'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProfileFormState = {
  firstName: string;
  lastName: string;
  age: string; // Use string for input compatibility
  mobileNumber: string;
};

export function EditProfileDialog({ isOpen, onOpenChange }: EditProfileDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userAccountRef = useMemoFirebase(() => user ? doc(firestore, 'userAccounts', user.uid) : null, [firestore, user]);
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, `userAccounts/${user.uid}/userProfile`, user.uid) : null, [firestore, user]);

  const { data: userAccountData, isLoading: isLoadingAccount } = useDoc(userAccountRef);
  const { data: userProfileData, isLoading: isLoadingProfile } = useDoc(userProfileRef);

  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    age: '',
    mobileNumber: '',
  });

  useEffect(() => {
    if (userAccountData && userProfileData) {
      setFormState({
        firstName: userAccountData.firstName || '',
        lastName: userAccountData.lastName || '',
        age: userProfileData.age?.toString() || '',
        mobileNumber: userProfileData.mobileNumber || '',
      });
    }
  }, [userAccountData, userProfileData]);

  const handleFormChange = (field: keyof ProfileFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user || !userAccountRef || !userProfileRef) return;
    
    try {
      // Non-blocking updates
      setDoc(userAccountRef, { 
        firstName: formState.firstName,
        lastName: formState.lastName,
      }, { merge: true });

      setDoc(userProfileRef, {
        age: formState.age ? parseInt(formState.age, 10) : null,
        mobileNumber: formState.mobileNumber,
      }, { merge: true });

      toast({ title: "Profile updated", description: "Your profile has been successfully updated." });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({ variant: 'destructive', title: "Error", description: "Failed to update profile." });
    }
  };
  
  const isLoading = isLoadingAccount || isLoadingProfile;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        {isLoading ? <p>Loading...</p> : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">First Name</Label>
              <Input id="firstName" value={formState.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">Last Name</Label>
              <Input id="lastName" value={formState.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Age</Label>
              <Input id="age" type="number" value={formState.age} onChange={(e) => handleFormChange('age', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mobileNumber" className="text-right">Mobile No.</Label>
              <Input id="mobileNumber" value={formState.mobileNumber} onChange={(e) => handleFormChange('mobileNumber', e.target.value)} className="col-span-3" />
            </div>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleSave} disabled={isLoading}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
