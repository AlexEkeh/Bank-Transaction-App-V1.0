import createError from 'http-errors';
import express, { Request, Response } from 'express';
import path from 'path';
import logger from 'morgan';
import appRouter from './routes';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));


// MAIN APPLICATION
app.use('/', appRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});



// error handler
app.use(function (
  err: createError.HttpError,
  req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
