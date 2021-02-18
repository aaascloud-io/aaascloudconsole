import { ErrorlistModule } from './errorlist.module';

describe('ContactsModule', () => {
  let contactsModule: ErrorlistModule;

  beforeEach(() => {
    contactsModule = new ErrorlistModule();
  });

  it('should create an instance', () => {
    expect(contactsModule).toBeTruthy();
  });
});
