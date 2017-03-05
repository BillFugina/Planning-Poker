define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Planning Poker';
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: 'routes/home/index' }
            ]);
        };
        return App;
    }());
    exports.App = App;
});

define('dependency-injection',["require", "exports", "services/SessionService"], function (require, exports, SessionService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DI = {
        ISessionService: { name: 'ISessionService' }
    };
    exports.Singletons = [
        { interface: exports.DI.ISessionService, implementation: SessionService_1.SessionService }
    ];
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", "environment", "dependency-injection"], function (require, exports, environment_1, dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        dependency_injection_1.Singletons.forEach(function (singleton) {
            aurelia.container.registerSingleton(singleton.interface, singleton.implementation);
        });
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('model/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('model/session',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('services/SessionService',["require", "exports", "aurelia-fetch-client"], function (require, exports, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SessionService = (function () {
        function SessionService() {
            this.client = new aurelia_fetch_client_1.HttpClient();
            this.client.configure(function (config) {
                config
                    .withBaseUrl('http://localhost:9002/api/')
                    .withDefaults({
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                });
            });
        }
        SessionService.prototype.StartSession = function (sessionName, masterName) {
            return __awaiter(this, void 0, void 0, function () {
                var response, sessionId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.client.fetch("startup/sessions/" + sessionName + "/" + masterName, {
                                method: 'post'
                            })];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            sessionId = _a.sent();
                            return [2 /*return*/, sessionId];
                    }
                });
            });
        };
        return SessionService;
    }());
    exports.SessionService = SessionService;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('routes/home/index',["require", "exports", "aurelia-framework", "dependency-injection"], function (require, exports, aurelia_framework_1, dependency_injection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Home = (function () {
        function Home(sessionService) {
            this.sessionService = sessionService;
        }
        Home.prototype.startSession = function () {
            this.sessionService.StartSession(this.session, this.master);
        };
        return Home;
    }());
    Home = __decorate([
        aurelia_framework_1.inject(dependency_injection_1.DI.ISessionService),
        __metadata("design:paramtypes", [Object])
    ], Home);
    exports.Home = Home;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"bootstrap/css/bootstrap.css\"></require><router-view></router-view></template>"; });
define('text!routes/home/index.html', ['module'], function(module) { module.exports = "<template><div class=\"container\"><div class=\"jumbotron\"><h1>Planning Poker</h1><form><div class=\"form-group\"><label for=\"session-name\">Session Name</label><input type=\"text\" class=\"form-control\" id=\"session-name\" placeholder=\"Session\" value.bind=\"session\"></div><div class=\"form-group\"><label for=\"your-name\">Your Name</label><input type=\"text\" class=\"form-control\" id=\"your-name\" placeholder=\"Name\" value.bind=\"master\"></div><p><a class=\"btn btn-primary btn-lg\" role=\"button\" click.delegate=\"startSession()\">Start Session</a></p></form></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map