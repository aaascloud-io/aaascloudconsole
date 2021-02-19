import { VersionModule } from './version.module';

describe('ContactsModule', () => {
  let contactsModule: VersionModule;

  beforeEach(() => {
    contactsModule = new VersionModule();
  });

  it('should create an instance', () => {
    expect(contactsModule).toBeTruthy();
  });
});
