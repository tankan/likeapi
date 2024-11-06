import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser(username: string, password: string): Observable<any> {
    return this.userService.findByUsername(username).pipe(
      mergeMap((user: UserDocument | null) => {
        if (user && user.password === password) {
          const { password: _, ...result } = user.toObject();
          return of(result);
        }
        return of(null);
      }),
    );
  }

  login(user: any): Observable<{ access_token: string }> {
    const payload = { username: user.username, sub: user._id };
    return of({
      access_token: this.jwtService.sign(payload),
    });
  }
}
