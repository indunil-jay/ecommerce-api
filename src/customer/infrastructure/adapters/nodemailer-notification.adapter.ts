import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { CUSTOMER_REPOSITORY, CustomerRepository } from "src/customer/application/ports/customer-repository.port";
import { INotification, Notification } from "src/customer/application/ports/notification.port";
import { CustomerId } from "src/customer/domain/value-objects/customer-id.vo";
import { ApplicationException } from "src/shared/domain/exceptions/application.exception";
import { ApplicationExceptionCode } from "src/shared/domain/enums/application-exception-code";

@Injectable()
export class NodeMailerNotificationAdapter implements INotification {
    private readonly transporter: nodemailer.Transporter;
    private readonly from: string;
    private readonly logger = new Logger(NodeMailerNotificationAdapter.name);

    constructor(
        private readonly configService: ConfigService,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow<string>('SMPT_HOST'),
            port: Number(this.configService.getOrThrow<string>('SMPT_PORT')),
            auth: {
                user: this.configService.getOrThrow<string>('SMPT_USER'),
                pass: this.configService.getOrThrow<string>('SMPT_PASSWORD'),
            },
        });
        this.from = this.configService.getOrThrow<string>('SMPT_FROM');
    }

    async send(notification: Notification): Promise<void> {
        const customer = await this.customerRepository.findById(new CustomerId(notification.recepientId));
        if (!customer) {
            throw new ApplicationException(
                `Customer not found by id ${notification.recepientId}`,
                ApplicationExceptionCode.NOT_FOUND
            );
        }
        await this.transporter.sendMail({
            from: this.from,
            to: customer.getEmail().getValue(),
            subject: notification.subject,
            html: notification.message,
        });
        this.logger.log(`Email sent to ${customer.getEmail().getValue()}`);
    }
}
