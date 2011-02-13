describe('Flunk:', function() {
  var env;
  var fakeTimer;

  beforeEach(function() {
    env = new jasmine.Env();
    env.updateInterval = 0;

    fakeTimer = new jasmine.FakeTimer();
    env.setTimeout = fakeTimer.setTimeout;
    env.clearTimeout = fakeTimer.clearTimeout;
    env.setInterval = fakeTimer.setInterval;
    env.clearInterval = fakeTimer.clearInterval;
  });

  it('should report flunked tests', function() {
    env.describe('Suite for handles exceptions', function () {
      env.it('fails due to bad expectation', function(){
        this.expect(false).toBeTruthy();
      });
      env.it('passing test', function(){
        this.expect(true).toBeTruthy();
      });

      env.it('gets flunked', function(){
        this.flunk('I gone got flunked!');
      });
    });

    var runner = env.currentRunner();
    runner.execute();

    var results = runner.results();
    //expect(results.passed()).toEqual(false);

    expect(results.totalCount).toEqual(3);
    expect(results.passedCount).toEqual(1);
    expect(results.failedCount).toEqual(2);

    var blocks = results.getItems()[0].getItems();

    expect(blocks[0].passed()).toBeFalsy();
    expect(blocks[0].getItems()[0].message).toMatch(/Expected false to be truthy/);

    expect(blocks[1].passed()).toBeTruthy();

    expect(blocks[2].passed()).toBeFalsy();
    expect(blocks[2].getItems()[0].message).toMatch(/I gone got flunked!/);


  });

});

