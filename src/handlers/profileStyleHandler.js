const Style = {
    font_id: 8,
    effect_id: 2,
    colors: [16777215, 255]
};

async function applyDisplayNameStyle(client){
    const guilds = client.guilds.cache.map(g => g.id);
    if (!guilds.length) return;

    const body = {
        display_name_font_id: Style.font_id,
        display_name_effect_id: Style.effect_id,
        display_name_colors: Style.colors
    }

    for (const guildId of guilds) {
        try {
            await client.rest.patch(`/guilds/${guildId}/members/@me`, { body });
        }
        catch (error) {
            console.error(`Error occurred while updating display name style for guild ${guildId}:`, error);
        }
    }
}

module.exports = { applyDisplayNameStyle };