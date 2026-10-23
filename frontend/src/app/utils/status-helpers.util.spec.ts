import { RequestStatus } from '../models/maintenanceRequest.model';
import { getStatusLabel } from './status-helpers.util';

describe('getStatusLabel', () => {
  it('writes ORÇADA with the cedilla the spec uses', () => {
    expect(getStatusLabel(RequestStatus.Quoted)).toBe('Orçada');
  });

  it('has a readable label for every state', () => {
    for (const status of Object.values(RequestStatus)) {
      expect(getStatusLabel(status)).not.toBe(status);
    }
  });

  it('falls back to the raw value, or empty when there is none', () => {
    expect(getStatusLabel('DESCONHECIDA')).toBe('DESCONHECIDA');
    expect(getStatusLabel(undefined)).toBe('');
  });
});
