function formatServerTime(timeFloat) {
  let hours = Math.floor(timeFloat);
  const minutes = Math.floor((timeFloat - hours) * 60);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hours}:${minutesStr} ${ampm}`;
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0 && m > 0) {
    return `${h}h ${m}m`;
  } else if (h > 0) {
    return `${h}h`;
  } else if (m > 0) {
    return `${m}m ${s}s`;
  } else {
    return `${s}s`;
  }
}

function calculateRealTimeSeconds(gameHoursDiff, dayLengthMinutes) {
  return (gameHoursDiff / 24) * dayLengthMinutes * 60;
}

/** @type {import("../commandHandler").Command} */
module.exports = {
  name: "time",
  description: "Shows the current in-game time",
  aliases: ["t"],
  execute(rustplus) {
    rustplus.getTime((response) => {
      if (response.response?.time) {
        const timeData = response.response.time;
        const currentTime = timeData.time;
        const sunrise = timeData.sunrise;
        const sunset = timeData.sunset;
        const dayLengthMinutes = timeData.dayLengthMinutes;
        
        const formattedTime = formatServerTime(currentTime);
        
        const isDay = currentTime >= sunrise && currentTime < sunset;
        const emoji = isDay ? ":light:" : ":nightvisiongoggles:";
        
        let gameHoursDiff;
        let nextPeriod;
        
        if (isDay) {
          gameHoursDiff = sunset - currentTime;
          nextPeriod = "night";
        } else {
          if (currentTime >= sunset) {
            gameHoursDiff = (24 - currentTime) + sunrise;
          } else {
            gameHoursDiff = sunrise - currentTime;
          }
          nextPeriod = "day";
        }
        
        const realTimeSeconds = calculateRealTimeSeconds(gameHoursDiff, dayLengthMinutes);
        const durationStr = formatDuration(realTimeSeconds);
        const message = `${emoji} ${formattedTime} (${durationStr} until ${nextPeriod})`;
        
        rustplus.sendTeamMessage(message);
      } else {
        rustplus.sendTeamMessage("Failed to get server time");
      }
    });
  },
};
