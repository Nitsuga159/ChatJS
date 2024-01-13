var AM_ATTRIBUTES_MAP = require("attributes-map").AM_ATTRIBUTES_MAP;
var parseDnFormat = require("date").parseDnFormat;
var OUTCOMES = {
    TRUE: "True",
    FALSE: "False",
    NONE: "None"
};

var userId = nodeState.get("_id")

function goTo(outcome) {
    logger.warn("{} outcome {}", scriptName, outcome);
    action.goTo(outcome);
}

function resetInvalidLoginCount(identity) {
    identity.setAttribute(userId, AM_ATTRIBUTES_MAP.LOGIN_FAILURE_COUNT, [0])
}

function itsTimeElapsed(dateInstance, timeToElapseMilliseconds) {
    return Date.now() - dateInstance.getTime() >= timeToElapseMilliseconds
}

(function() {
  try {
    if(!userId) {
      logger.debug("{} _id from nodeState is undefined", scriptName)
      return goTo(OUTCOMES.FALSE)
    }

    var identity = idRepository.getIdentity(userId)

    var lastInvalidLoginAttempt = identity.getAttributeValues(userId, AM_ATTRIBUTES_MAP.LAST_INVALID_LOGIN_DATE)
    var timeToRestarInvalidCount = nodeState.get("timeToRestarInvalidCount") * 60 * 1000
    var timeToElapseLockedout = nodeState.get("timeToElapseLockedout") * 60 * 1000

    if(lastInvalidLoginAttempt.length) {
        lastInvalidLoginAttempt = parseDnFormat(lastInvalidLoginAttempt.get(0))

        if(itsTimeElapsed(lastInvalidLoginAttempt, timeToRestarInvalidCount)) {
            resetInvalidLoginCount(identity)
        }
    }
    
	var accountStatus = String(identity.getAttributeValues(userId, "inetUserStatus").get(0)).toLocaleLowerCase()
    
    logger.debug("{} accountStatus: {}", scriptName, accountStatus)
    
    if(accountStatus === "active") {
      	return goTo(OUTCOMES.NONE)
    }
    
    var timestampLockedout = parseDnFormat( identity.getAttributeValues(userId, AM_ATTRIBUTES_MAP.LOCKEDOUT_DATE).get(0) )
    var timeEnded = itsTimeElapsed(timestampLockedout, timeToElapseLockedout)
    
    logger.debug(scriptName + "timestamp -> {}", timestampLockedout.toLocaleDateString())
    
    logger.debug(scriptName + "time elapsed ? -> {}", timeEnded)

    if(timeEnded) {
      resetInvalidLoginCount(identity)
      goTo(OUTCOMES.TRUE)
    } else {
      goTo(OUTCOMES.FALSE)
    }
  } catch(e) {
  	logger.error("{} error: {}", scriptName, e)
    goTo(OUTCOMES.FALSE)
  }
}())

