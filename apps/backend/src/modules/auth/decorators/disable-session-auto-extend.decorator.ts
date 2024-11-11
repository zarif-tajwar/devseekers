import { Reflector } from "@nestjs/core";

export const DisableSessionAutoExtend = Reflector.createDecorator<
  true | undefined
>();
