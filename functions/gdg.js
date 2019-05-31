// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Import the Meetup API client
const meetup = require('meetup-api')();

/**
 * Class defining a Google Developer Group
 */
class Gdg {
    constructor(gdgId) {
        this.gdgId = gdgId;
    }

    /**
     * Retrieves group info using the Meetup API.
     * @private
     */
    _getGroupInfo() {
        return new Promise((resolve, reject) => {
            // `https://api.meetup.com/${gdgId}`
            meetup.getGroup({
                urlname: this.gdgId,
            }, (err, resp) => {
               if (err) {
                    reject(err);
                } else {
                    this.info = resp;
                    resolve(resp);
                }
            });
        });
    }

    /**
     * Retrieves details for an event.
     * @private
     */
    getEvent(eventId) {
        return new Promise((resolve, reject) => {
            // `https://api.meetup.com/${gdgId}/events/${eventId}`
            meetup.getEvent({
                urlname: this.gdgId,
                id: eventId,
            }, (err, resp) => {
               if (err) {
                    console.log('getEvent - err: ' + err);
                    reject(err);
                } else {
                    resolve(resp);
                }
            });
        });
    }

    getOrganizer() {
        return this._getGroupInfo().then((info) => info.organizer);
    }

    getMembers() {
        return this._getGroupInfo().then((info) => info.members);
    }

    getDescription() {
        return this._getGroupInfo().then((info) => info.description);
    }

    getNextEvent() {
        return this._getGroupInfo().then((info) => {
            if (!info.next_event) {
                return null;
            }

            return this.getEvent(info.next_event.id);
        });
    }

    getLastEvent() {
        return this.getLastEventId().then((eventId) => {
            if (!eventId) {
                return null;
            }

            return this.getEvent(eventId);
        });
    }

    /**
     * Retrieves id of the last event organized by this GDG.
     * @private
     */
    getLastEventId() {
        if (this.lastEventId !== undefined) {
            return Promise.resolve(this.lastEventId);
        }

        return this._getGroupInfo().then((info) => {
            return new Promise((resolve, reject) => {
                // `https://api.meetup.com/2/events`
                meetup.getEvents({
                    group_urlname: this.gdgId,
                    status: 'past',
                    desc: 'true',
                    page: 1,
                }, (err, resp) => {
                if (err) {
                        console.log('getLastEventId - err: ' + err);
                        reject(err);
                    } else {
                        if (resp && resp.results && resp.results[0]) {
                            this.lastEventId = resp.results[0].id;
                            resolve(resp.results[0].id);
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        });
    }
}

module.exports = {
    Gdg,
};
