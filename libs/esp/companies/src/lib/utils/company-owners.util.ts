import { UserTeam } from '@esp/autocomplete';
import { OwnerAggregation, OwnerAggregationSerialized } from '../models';

export function extractCompanyOwnerIds(
  owners: OwnerAggregationSerialized[]
): number[] {
  return owners.map((owner) => extractCompanyOwnerId(owner)).filter(Boolean);
}

function extractCompanyOwnerId(owner: OwnerAggregationSerialized): number {
  return parseInt(owner.split(':')[1]);
}

export function mapUserTeamsToCompanyOwnerAggregations(
  userTeams: UserTeam[]
): OwnerAggregation[] {
  const users = userTeams.filter((userTeam) => !userTeam.IsTeam);

  return users.map((user) => mapUserTeamToCompanyOwnerAggregation(user));
}

function mapUserTeamToCompanyOwnerAggregation(
  userTeam: UserTeam
): OwnerAggregation {
  return {
    Id: userTeam.Id,
    Email: userTeam.Email || null,
    IconImageUrl: userTeam.IconMediaLink?.FileUrl || null,
    Name: userTeam.Name,
  };
}
