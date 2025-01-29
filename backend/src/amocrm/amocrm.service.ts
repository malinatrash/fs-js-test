import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AmoCRMService {
  private readonly logger = new Logger(AmoCRMService.name);
  private accessToken: string;
  private baseDomain: string;

  async initialize() {
    try {
      const clientId = process.env.AMOCRM_CLIENT_ID;
      this.logger.log('Initializing amoCRM service...');
      this.logger.debug(`Using Client ID: ${clientId}`);

      if (!clientId) {
        this.logger.error(
          'AMOCRM_CLIENT_ID is not set in environment variables',
        );
        throw new HttpException(
          'AMOCRM_CLIENT_ID is not configured',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      this.logger.log('Making request to get access token...');
      const response = await axios.get(
        'https://app2.gnzs.ru/amocrm/test/oauth/get-token.php',
        {
          headers: {
            'X-Client-Id': clientId,
          },
        },
      );

      this.logger.debug('Token response received', response.data);

      if (!response.data.access_token || !response.data.base_domain) {
        this.logger.error(
          'Invalid response format from token endpoint',
          response.data,
        );
        throw new HttpException(
          'Invalid token response',
          HttpStatus.BAD_GATEWAY,
        );
      }

      this.accessToken = response.data.access_token;
      this.baseDomain = response.data.base_domain;
      this.logger.log(
        `Successfully initialized amoCRM with domain: ${this.baseDomain}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize amoCRM:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new HttpException(
        error.response?.data?.message || 'Failed to initialize amoCRM',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getApiUrl(endpoint: string): string {
    return `https://${this.baseDomain}/api/v4/${endpoint}`;
  }

  private async makeRequest(method: string, endpoint: string, data?: any) {
    if (!this.accessToken) {
      this.logger.log('No access token found, initializing amoCRM');
      await this.initialize();
    }

    const url = this.getApiUrl(endpoint);
    this.logger.log(`Making ${method} request to ${url}`);
    this.logger.debug('Request data:', data);

    try {
      const response = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      this.logger.debug('Response received:', response.data);
      return response.data;
    } catch (error) {
      this.logger.error(`amoCRM API request failed for ${endpoint}:`, {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: data,
      });
      throw new HttpException(
        error.response?.data?.message || 'amoCRM API request failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDeal() {
    this.logger.log('Creating new deal');
    const data = {
      name: 'New Deal',
      created_by: 0,
      price: 0,
      status_id: 0,
    };
    try {
      const response = await this.makeRequest('POST', 'leads', [data]);
      const dealId = response._embedded.leads[0].id;
      this.logger.log(`Successfully created deal with ID: ${dealId}`);
      return dealId;
    } catch (error) {
      this.logger.error('Failed to create deal:', error);
      throw error;
    }
  }

  async createContact() {
    this.logger.log('Creating new contact');
    const data = {
      name: 'New Contact',
      created_by: 0,
      responsible_user_id: 0,
    };
    try {
      const response = await this.makeRequest('POST', 'contacts', [data]);
      const contactId = response._embedded.contacts[0].id;
      this.logger.log(`Successfully created contact with ID: ${contactId}`);
      return contactId;
    } catch (error) {
      this.logger.error('Failed to create contact:', error);
      throw error;
    }
  }

  async createCompany() {
    this.logger.log('Creating new company');
    const data = {
      name: 'New Company',
      created_by: 0,
      responsible_user_id: 0,
    };
    try {
      const response = await this.makeRequest('POST', 'companies', [data]);
      const companyId = response._embedded.companies[0].id;
      this.logger.log(`Successfully created company with ID: ${companyId}`);
      return companyId;
    } catch (error) {
      this.logger.error('Failed to create company:', error);
      throw error;
    }
  }
}
