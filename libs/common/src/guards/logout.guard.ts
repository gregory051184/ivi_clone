import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";


@Injectable()
export class LogoutGuard implements CanActivate {
    constructor() {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const res = context.switchToHttp().getResponse();
        res.cookie('Role', "", {
            httpOnly: true
        })
        return true;
    }
}