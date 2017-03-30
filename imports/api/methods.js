import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


import walmart from 'walmart';

Meteor.methods({
	"walmart.search"(query) {
		console.log("Search walmart");
		check(query, String);
		//let myWalmart = walmart(process.env.WALMART_API_KEY);
		let myWalmart = walmart('acc828nd6mdxeqwqt7fz5s7m');
    // Return the promise
    return myWalmart.search(query);
	},

    "walmart.recomend"(query) {
        console.log("Recomend walmart");
        check(query, String);
        //let myWalmart = walmart(process.env.WALMART_API_KEY);
        let myWalmart = walmart('acc828nd6mdxeqwqt7fz5s7m');
        // Return the promise
        return myWalmart.recommendations(query);
    }

});
