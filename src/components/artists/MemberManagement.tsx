'use client';

import React, { useState } from 'react';
import { Artist, ArtistMember } from 'bndy-types';
import { ArtistService } from '@/lib/services/artist-service';
import { useArtist } from '@/lib/context/artist-context';
import { useAuth } from 'bndy-ui';
import { Users, UserPlus, Mail, X, Check, Shield, Star } from 'lucide-react';

interface MemberManagementProps {
  artist: Artist;
}

export default function MemberManagement({ artist }: MemberManagementProps) {
  const { currentUser } = useAuth();
  const { refreshArtists } = useArtist();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);

  // Check if current user is owner
  const isOwner = currentUser ? artist.members.some(
    member => member.userId === currentUser.uid && member.role === 'owner'
  ) : false;

  // Check if current user is admin or owner
  const canManageMembers = currentUser ? artist.members.some(
    member => member.userId === currentUser.uid && (member.role === 'owner' || member.role === 'admin')
  ) : false;

  // Handle member invitation
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if member already exists
      const memberExists = artist.members.some(member => member.displayName === email);
      if (memberExists) {
        setError('This person is already a member of this artist/band');
        return;
      }
      
      // Invite member
      await ArtistService.inviteMember(artist.id, {
        email,
        role,
        invitedBy: currentUser?.uid || '',
        invitedAt: new Date().toISOString()
      });
      
      // Refresh artist data
      await refreshArtists();
      
      // Show success message
      setSuccess(`Invitation sent to ${email}`);
      setEmail('');
      setRole('member');
      
      // Hide form after 2 seconds
      setTimeout(() => {
        setShowInviteForm(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error inviting member:', err);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle removing a member
  const handleRemoveMember = async (memberId: string) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Remove member
      await ArtistService.removeMember(artist.id, memberId);
      
      // Refresh artist data
      await refreshArtists();
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle changing a member's role
  const handleChangeRole = async (memberId: string, newRole: 'owner' | 'admin' | 'member') => {
    // If changing owner, show confirmation
    if (newRole === 'owner') {
      if (!window.confirm('Are you sure you want to transfer ownership? You will no longer be the owner.')) {
        return;
      }
    }
    
    try {
      setLoading(true);
      
      // Update member role
      await ArtistService.updateMemberRole(artist.id, memberId, newRole);
      
      // Refresh artist data
      await refreshArtists();
    } catch (err) {
      console.error('Error updating member role:', err);
      setError('Failed to update member role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get role badge component
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-500 text-white">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-600 text-white">
            <Users className="h-3 w-3 mr-1" />
            Member
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="mr-2" />
          Band Members
        </h2>
        
        {canManageMembers && (
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-1.5" />
            {showInviteForm ? 'Cancel' : 'Invite Member'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
          <p className="flex items-center">
            <X className="h-4 w-4 mr-2" />
            {error}
          </p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-500 px-4 py-3 rounded mb-4">
          <p className="flex items-center">
            <Check className="h-4 w-4 mr-2" />
            {success}
          </p>
        </div>
      )}
      
      {showInviteForm && (
        <form onSubmit={handleInviteMember} className="mb-6 bg-slate-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Invite New Member</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-600 border border-slate-500 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
                className="w-full bg-slate-600 border border-slate-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-xs text-slate-400 mt-1">
                Members can view and participate. Admins can also invite and manage members.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Member
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Role
              </th>
              {canManageMembers && (
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {artist.members.map((member) => (
              <tr key={member.userId} className="hover:bg-slate-700/50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-300">
  {member.displayName?.charAt(0) || '?'}
</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{member.displayName || 'Invited User'}</p>
                      
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getRoleBadge(member.role)}
                </td>
                {canManageMembers && (
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Don't show actions for current user or for the owner if current user is not the owner */}
                    {member.userId !== currentUser?.uid && (member.role !== 'owner' || isOwner) && (
                      <div className="flex justify-end space-x-2">
                        {isOwner && member.role !== 'owner' && (
                          <button
                            onClick={() => handleChangeRole(member.userId, member.role === 'admin' ? 'member' : 'admin')}
                            className="text-cyan-400 hover:text-cyan-300"
                            title={member.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
                          >
                            {member.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                        )}
                        
                        {isOwner && (
                          <button
                            onClick={() => handleChangeRole(member.userId, 'owner')}
                            className="text-orange-400 hover:text-orange-300"
                            title="Transfer Ownership"
                          >
                            Make Owner
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          className="text-red-400 hover:text-red-300"
                          title="Remove Member"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {artist.members.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No members yet.</p>
        </div>
      )}
    </div>
  );
}
