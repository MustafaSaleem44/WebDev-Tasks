const userRouter = require('./routes/user');
const comRouter = require('./routes/com');

app.use('/users', userRouter);
app.use('/comments', comRouter);