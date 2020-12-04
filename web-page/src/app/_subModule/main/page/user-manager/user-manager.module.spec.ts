import { UserManagerModule } from './user-manager.module';

describe('UserManagerModule', () => {
  let userManagerModule: UserManagerModule;

  beforeEach(() => {
    userManagerModule = new UserManagerModule();
  });

  it('should create an instance', () => {
    expect(userManagerModule).toBeTruthy();
  });
});
