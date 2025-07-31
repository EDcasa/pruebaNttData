import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when show() is called', (done) => {
    service.isLoading$.subscribe((value) => {
      if (value === true) {
        expect(value).toBe(true);
        done();
      }
    });

    service.show();
  });

  it('should emit false when hide() is called', (done) => {
    service.show(); // set true first to ensure change

    service.isLoading$.subscribe((value) => {
      if (value === false) {
        expect(value).toBe(false);
        done();
      }
    });

    service.hide();
  });

  it('should start with false', (done) => {
    service.isLoading$.subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });
});
