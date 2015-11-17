Reload
======

Reload is a tool for conditionally reloading a page.

## Use Case

* Wall Displays - Have your application refresh itself when new code is available without having to access it to manually refresh the page. 

## Examples

### Check a JSON file for changes to a value on your server

JavaScript:

    reload.ifThisChangesOverTime('version.json', 10000, checkForVersion);

    function checkForVersion(response) {
        return response.version;
    }


version.json:

    {
        "version": "0.0.1"
    }

### Just reload now, on your own terms

JavaScript:

    reload.now();