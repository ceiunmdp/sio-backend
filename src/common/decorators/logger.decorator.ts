// import { Inject } from '@nestjs/common';
// import { CustomLoggerService } from 'src/logger/custom-logger.service';

// export const Logger = (context: string): MethodDecorator & ClassDecorator => {
//   const logger = Inject(CustomLoggerService);
//   logger.context = context;

//   return (target: Function) => {
//     console.log(target);
//     target.logger = logger;

//     // // this is equivalent to have a constructor like constructor(yourservice: YourServiceClass)
//     // // note that this will injected to the instance, while your decorator runs for the class constructor
//     // injectYourService(target, 'yourservice');

//     // // do something in you decorator

//     // // we use a ref here so we can type it
//     // const yourservice: YourServiceClass = this.yourservice;
//     // yourservice.someMethod(someParam);
//   };
// };
