import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
);

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const req = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return false;

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.user = data.user;
    return true;
  }
}
