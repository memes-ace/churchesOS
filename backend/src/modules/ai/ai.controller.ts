import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';

@Controller('churches/:churchId/ai')
@UseGuards(AuthGuard('jwt'))
export class AiController {
  constructor(private svc: AiService) {}

  @Post('chat')
  chat(@Param('churchId') id: string, @Body() body: { message: string }) {
    return this.svc.chat(id, body.message).then(r => ({ response: r }));
  }

  @Get('analytics')
  analytics(@Param('churchId') id: string) { return this.svc.getAnalytics(id); }

  @Get('engagement')
  engagement(@Param('churchId') id: string) { return this.svc.getEngagement(id); }

  @Get('growth')
  growth(@Param('churchId') id: string) { return this.svc.getGrowth(id); }
}
