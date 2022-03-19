import 'dotenv/config';
import { app } from './app';

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`💡 Note-Taking-App server running at port ${port}`);
});
