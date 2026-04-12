import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

import { DashboardProfileFormProps } from '../../lib/types';

const DashboardProfileForm = ({
  formData,
  validationErrors,
  onFieldChange,
  onSave,
}: DashboardProfileFormProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3">Edit Profile</h3>
        <div className="space-y-2">
          <div>
            <label htmlFor="profileName" className="text-xs font-medium">Display Name</label>
            <Input
              id='profileName'
              value={(formData.profileName as string) || ''}
              onChange={(e) => onFieldChange('profileName', e.target.value)}
              placeholder="Your name"
              className="h-8 text-sm mt-1"
            />
            {validationErrors.profileName && (
              <p className="mt-1 text-xs text-destructive">{validationErrors.profileName}</p>
            )}
          </div>

          <div>
            <label htmlFor="profileEmail" className="text-xs font-medium">Email</label>
            <Input
              id='profileEmail'
              value={(formData.profileEmail as string) || ''}
              onChange={(e) => onFieldChange('profileEmail', e.target.value)}
              placeholder="your@email.com"
              className="h-8 text-sm mt-1"
            />
            {validationErrors.profileEmail && (
              <p className="mt-1 text-xs text-destructive">{validationErrors.profileEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor='profileBio' className="text-xs font-medium">Bio</label>
            <Input
              id='profileBio'
              value={(formData.profileBio as string) || ''}
              onChange={(e) => onFieldChange('profileBio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="h-8 text-sm mt-1"
            />
            {validationErrors.profileBio && (
              <p className="mt-1 text-xs text-destructive">{validationErrors.profileBio}</p>
            )}
          </div>

          <Button aria-label="profile" size="sm" className="mt-1" onClick={onSave}>
            Save Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfileForm;
