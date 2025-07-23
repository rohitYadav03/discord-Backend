import { createBullBoard } from '@bull-board/api'; // createBullBoard to bootstrap the dashboard.
import { BullAdapter } from '@bull-board/api/bullAdapter.js'; // BullAdapter to convert each Bull queue into a format Bull‑Board understands.
import { ExpressAdapter } from '@bull-board/express'; // ExpressAdapter to let Bull‑Board attach its routes to an Express server.
import mailQueue from '../queue/mailQueue.js';


const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');

createBullBoard({
  queues: [
    new BullAdapter(mailQueue)
  ],
  serverAdapter: bullServerAdapter
});

export default bullServerAdapter;
