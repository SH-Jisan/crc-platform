import { Test, TestingModule } from '@nestjs/testing';
import { CustomCausesDonationService } from './custom-causes-donation.service';

describe('CustomCausesDonationService', () => {
  let service: CustomCausesDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomCausesDonationService],
    }).compile();

    service = module.get<CustomCausesDonationService>(CustomCausesDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
