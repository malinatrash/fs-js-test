import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AmoCRMService } from './amocrm.service';

@Controller('api/entities')
export class AmoCRMController {
  private readonly logger = new Logger(AmoCRMController.name);

  constructor(private readonly amoCRMService: AmoCRMService) {}

  @Post()
  async createEntity(@Body('type') type: string) {
    this.logger.log(`Received request to create entity of type: ${type}`);

    if (!type) {
      this.logger.error('Entity type is required');
      throw new HttpException('Entity type is required', HttpStatus.BAD_REQUEST);
    }

    try {
      let id: string;

      switch (type) {
        case 'deal':
          this.logger.log('Creating new deal');
          id = await this.amoCRMService.createDeal();
          break;
        case 'contact':
          this.logger.log('Creating new contact');
          id = await this.amoCRMService.createContact();
          break;
        case 'company':
          this.logger.log('Creating new company');
          id = await this.amoCRMService.createCompany();
          break;
        default:
          this.logger.error(`Invalid entity type: ${type}`);
          throw new HttpException(
            `Invalid entity type: ${type}. Must be one of: deal, contact, company`,
            HttpStatus.BAD_REQUEST,
          );
      }

      this.logger.log(`Successfully created ${type} with ID: ${id}`);
      return { id, type };
    } catch (error) {
      this.logger.error(`Error creating ${type}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || `Failed to create ${type}`,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
