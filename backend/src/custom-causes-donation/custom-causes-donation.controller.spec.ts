import { Test, TestingModule } from '@nestjs/testing';
import { CustomCausesDonationController } from './custom-causes-donation.controller';

describe('CustomCausesDonationController', () => {
  let controller: CustomCausesDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomCausesDonationController],
    }).compile();

    controller = module.get<CustomCausesDonationController>(CustomCausesDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
