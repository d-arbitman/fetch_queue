/**
 * Queue for fetch requests
 */
export class FetchQueue {
  /**
   * create a new FetchQueue instance
   *
   * @param { number } numActiveRequests number of simultaneous requests
   * @param { Function } callback function to execute when each request in the queue executes successfully
   * @param { Function } errorCallback function to execute when each request in the queue fails
   * @param { Function } queueUpdatedCallback function to execute when the queue is updated
   * @param { Function } statusUpdatedCallback function to update when the status is updated
   */
  constructor(numActiveRequests, callback, errorCallback, queueUpdatedCallback, statusUpdatedCallback) {
    this.numActiveRequests = numActiveRequests;
    this.callback = callback;
    this.errorCallback = errorCallback;
    this.queueUpdatedCallback = queueUpdatedCallback;
    this.statusUpdatedCallback = statusUpdatedCallback;

    this.queuedRequests = [];
    this.activeRequests = [];
    this.updateStatus(QueueStatus.idle);
  }

  setCallback(callback) {
    this.callback = callback;
  }

  setErrorCallback(errorCallback) {
    this.errorCallback = errorCallback;
  }

  setQueueUpdatedCallback(queueUpdatedCallback) {
    this.queueUpdatedCallback = queueUpdatedCallback;
  }

  setStatusUpdatedCallback(statusUpdatedCallback) {
    this.statusUpdatedCallback = statusUpdatedCallback;
  }

  /**
   * adds a request to the queue
   *
   * @param { string } url to POST request to
   * @param { object } options fetch options in the POST request
   * @return { void }
   */
  addRequest(url, options) {
    this.queuedRequests.push({ url, options });
    this.queueUpdated();
  }

  /**
   * updates the queue's internal status
   *
   * @param { QueueStatus } newStatus new status to set
   * @return { void }
   */
  updateStatus(newStatus) {
    if (!(newStatus instanceof QueueStatus)) {
      throw new Error('Invalid status type');
    } else {
      this.status = newStatus;

      if (this.statusUpdatedCallback) {
        this.statusUpdatedCallback(newStatus);
      }
    }
  }

  /**
   * returns content from HTTP request based on content type header
   * @param { Response } response HTTP response
   * @return { Document|* }
   */
  parseContent(response) {
    const contentType = response.headers.get('content-type');

    if (contentType) {
      if (contentType.includes('application/json')) {
        return response
          .json();
      } else if (contentType.includes('application/xml')) {
        return response
          .text()
          .then(xml => xml);
      }
    }

    return response
      .text()
      .then(text => text);
  }

  /**
   * executes the requests in {@link this.queuedRequests}, stops if the status is updated to {@link QueueStatus.stopped}
   * after each request, executes callback if it has been defined
   *
   * @return { void }
   */
  executeRequests() {
    while (this.activeRequests.length < this.numActiveRequests && this.queuedRequests.length > 0 && this.status !== QueueStatus.stopped) {
      const req = this.queuedRequests.shift();

      this.activeRequests.push(req);
      this.queueUpdated();
      this.updateStatus(QueueStatus.active);

      fetch(req.url, req.options)
        .then(resp => {
          return resp;
        })
        .then(resp => this.parseContent(resp))
        .then((data) => {
          for (let i = 0; i < this.activeRequests.length; i++) {
            if (this.activeRequests[i] === req) {
              this.activeRequests.splice(i);
              break;
            }
          }

          this.queueUpdated();
          this.executeRequests();

          if (this.callback) {
            this.callback(req, data);
          }
        })
        .catch((error) => {
          if (this.errorCallback) {
            this.errorCallback(error);
          }
        })
        .finally(() => this.updateStatus(QueueStatus.idle));
    }
  }

  /**
   * updates the {@link this.queueStatus} when the {@link this.queuedRequests} has changed and
   * executes {@link this.queueUpdatedCallback} if defined
   *
   * @return { void }
   */
  queueUpdated() {
    if (this.queuedRequests.length === 0 && this.activeRequests.length === 0) {
      this.updateStatus(QueueStatus.idle);
    } else if (this.queuedRequests.length === 0 && this.activeRequests.length !== 1) {
      this.updateStatus(QueueStatus.active);
    } else if (this.queuedRequests.length !== 0) {
      this.updateStatus(QueueStatus.queued);
    }

    if (this.queueUpdatedCallback) {
      this.queueUpdatedCallback(this.queuedRequests, this.activeRequests);
    }
  }

  /**
   * resets the {@link this.queuedRequests} and updates the {@link this.queueStatus}
   *
   * @return { void }
   */
  resetQueue() {
    this.queuedRequests = [];
    this.queueUpdated();
  }
}

/**
 * enum for statuses for FetchQueue class
 */
class QueueStatus {
  static idle = new QueueStatus('idle');
  static stopped = new QueueStatus('stopped');
  static active = new QueueStatus('active');
  static queued = new QueueStatus('queued');

  constructor(name) {
    this.name = name;
  }
}
