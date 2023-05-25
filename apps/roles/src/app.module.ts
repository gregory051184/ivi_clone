import {forwardRef, Module} from '@nestjs/common';
import {CommonModule} from "@app/common";
import {ConfigModule} from "@nestjs/config";
import {RolesModule} from "./roles/roles.module";


@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".env"
        }),
        RolesModule,
        CommonModule
    ]
})

export class AppModule {
}