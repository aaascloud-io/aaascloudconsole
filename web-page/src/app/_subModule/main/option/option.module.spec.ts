import { OptionModule } from './option.module';

describe('OptionModule', () => {
  let optionModule: OptionModule;

  beforeEach(() => {
    optionModule = new OptionModule();
  });

  it('should create an instance', () => {
    expect(optionModule).toBeTruthy();
  });
});
