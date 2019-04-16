"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const pg = require("pg");
require("should");
const psychopiggy = require("psychopiggy");
const fs_1 = require("fs");
const path_1 = require("path");
const shouldLib = require("should");
const [dropTablesSQL, createTablesSQL] = ["drop-tables", "create-tables"].map(filename => fs_1.readFileSync(path_1.join(__dirname, `../../pgschema/${filename}.sql`)).toString());
if ([
    process.env.XNIPPET_TESTDB,
    process.env.XNIPPET_HOST,
    process.env.XNIPPET_PASSWORD,
    process.env.XNIPPET_PORT,
    process.env.XNIPPET_USER
].some(x => typeof x === "undefined")) {
    // tslint:disable:max-line-length
    throw new Error(`Test env variables are not set. You need to set XNIPPET_TESTDB, XNIPPET_HOST, XNIPPET_PASSWORD, XNIPPET_PORT and XNIPPET_USER`);
    // tslint:enable:max-line-length
}
const config = {
    database: process.env.XNIPPET_TESTDB,
    host: process.env.XNIPPET_HOST,
    password: process.env.XNIPPET_PASSWORD,
    port: process.env.XNIPPET_PORT
        ? parseInt(process.env.XNIPPET_PORT, 10)
        : 5432,
    user: process.env.XNIPPET_USER
};
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
describe("psychopiggy", () => {
    // Create a database
    before(function resetDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = new pg.Pool(Object.assign({}, config, { database: "template1" }));
            const { rows: existingDbRows } = yield pool.query(`SELECT 1 AS result FROM pg_database
    WHERE datname='${config.database}'`);
            if (existingDbRows.length) {
                yield pool.query(`DROP DATABASE ${config.database}`);
            }
            yield pool.query(`CREATE DATABASE ${config.database}`);
        });
    });
    beforeEach(function resetTables() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = new pg.Pool(config);
            yield pool.query(dropTablesSQL);
            yield pool.query(createTablesSQL);
        });
    });
    afterEach(function resetPools() {
        return __awaiter(this, void 0, void 0, function* () {
            yield psychopiggy.endPools();
        });
    });
    it("returns Params", () => __awaiter(this, void 0, void 0, function* () {
        const params = new psychopiggy.Params({ username: "jeswin" });
        shouldLib.exist(params);
    }));
    // it("creates a pool", async () => {
    //   psychopiggy.createPool({ ...config, user: "alice" });
    //   psychopiggy.createPool({ ...config, user: "bob" });
    //   const numPools = psychopiggy.internalNumPools();
    //   numPools.should.equal(2);
    // });
    // it("reuses a pool for existing config", async () => {
    //   psychopiggy.createPool({ ...config, user: "alice" });
    //   psychopiggy.createPool({ ...config, user: "alice" });
    //   const numPools = psychopiggy.internalNumPools();
    //   numPools.should.equal(1);
    // });
    // it("gets a pool and runs a query", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (
    //     username, password, email) VALUES ('jeswin', 'secretive', 'jeswin@example.com')`
    //   );
    // });
    // it("ends a pool", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (
    //     username, password, email) VALUES ('jeswin', 'secretive', 'jeswin@example.com')`
    //   );
    //   await psychopiggy.endPool(config);
    //   psychopiggy.internalNumPools().should.equal(0);
    // });
    // it("can use prepared statements", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const params = new psychopiggy.Params({
    //     email: "jeswin@example.com",
    //     password: "helloworld",
    //     username: "jeswin"
    //   });
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (${params.columns()}) VALUES (${params.ids()})`,
    //     params.values()
    //   );
    // });
    // it("returns a client", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (
    //     username, password, email) VALUES ('jeswin', 'secretive', 'jeswin@example.com')`
    //   );
    //   const result = (await psychopiggy.withClient(
    //     async client => await client.query(`SELECT * FROM account`),
    //     config
    //   )) as any;
    //   shouldLib.exist(result);
    //   result.rows.length.should.equal(1);
    //   result.rows[0].username.should.equal("jeswin");
    // });
    // it("commits a successful transaction", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (
    //     username, password, email) VALUES ('jeswin', 'secretive', 'jeswin@example.com')`
    //   );
    //   await psychopiggy.withTransaction(async client => {
    //     await client.query(`INSERT INTO account (
    //       username, password, email) VALUES ('jeswin1', 'secretive1', 'jeswin1@example.com')`);
    //     await client.query(`INSERT INTO account (
    //         username, password, email) VALUES ('jeswin2', 'secretive2', 'jeswin2@example.com')`);
    //   }, config);
    //   const result = (await psychopiggy.withClient(async client => {
    //     return await client.query(`SELECT * FROM account`);
    //   }, config)) as any;
    //   shouldLib.exist(result);
    //   result.rows.length.should.equal(3);
    //   result.rows[0].username.should.equal("jeswin");
    //   result.rows[1].username.should.equal("jeswin1");
    //   result.rows[2].username.should.equal("jeswin2");
    // });
    // it("rolls back an erroring transaction", async () => {
    //   psychopiggy.createPool(config);
    //   const pool = psychopiggy.getPool(config);
    //   const { rows } = await pool.query(
    //     `INSERT INTO account (
    //     username, password, email) VALUES ('jeswin', 'secretive', 'jeswin@example.com')`
    //   );
    //   await psychopiggy.withTransaction(async client => {
    //     client.query(`INSERT INTO account (
    //       username, password, email) VALUES ('jeswin1', 'secretive', 'jeswin1@example.com')`);
    //     throw new Error();
    //   }, config);
    //   const result = (await psychopiggy.withClient(async client => {
    //     return await client.query(`SELECT * FROM account`);
    //   }, config)) as any;
    //   shouldLib.exist(result);
    //   result.rows.length.should.equal(1);
    //   result.rows[0].username.should.equal("jeswin");
    // });
});
//# sourceMappingURL=test.js.map