function is_done(entity){
    var coords = rotateCoords(entity.components.tile.value[0], entity.components.tile.value[1], map[0].length, global_view);
    return (build_time[coords[0]][coords[1]] == 0);
}


ECS.systems.updatebuild = function systemUpdateBuild (entities, delta) {
    var total_d_water = 0;
    var total_d_ore = 0;
    var total_power = 0;
    var all_buildings = new PQueue();
    for( var entityId in entities ){
          entity = entities[entityId];
          if (entity.components.type.value == "build"){
              if (is_done(entity)){
                  var cons = entity.components.consumption.value;
                  if (entity.components.status.value.top() === "on") total_power += cons[2] * (cons[2] > 0);
                  all_buildings.insert(entityId, cons[2] * (cons[2] < 0));
                  if (entity.components.status.value.top() != "off"){
                      entity.components.status.value.pop(); //Empty status queue
                  }
              }
          }
    }

    power = total_power;
    var remaining_power = total_power;
    //Turn on buildings from smallest power consumption to biggest
    while (!all_buildings.isEmpty()){
        var b = all_buildings.pop();
        if (b[1] + remaining_power >= 0){
            if (entities[b[0]].components.status.value.top() != "off"){

                entities[b[0]].components.status.value.push("on");
                remaining_power += b[1];
            }
        } else {
            break;
        }
    }
    //Only the operational buildings consume
    for( var entityId in entities ){
          entity = entities[entityId];
          if (entity.components.type.value == "build" && entity.components.status.value.top() == "on" && is_done(entity)){
              var cons = entity.components.consumption.value;
              total_d_water -= cons[1];
              total_d_ore -= cons[0];
              var tile = entity.components.tile.value;
              var newCoords = rotateCoords(tile[0], tile[1], map[0].length, global_view);
              //If building is a fan lower water level
              if (buildings[newCoords[0]][newCoords[1]][0] == 5){
                  d_level -= 0.002;
                  //water_level -= 0.002;
              }
              heat += cons[3];
          }
    }
    console.log(heat);
    d_ore = total_d_ore;
    d_water = total_d_water;
    ore = Math.max(ore + total_d_ore, 0);
    water = Math.max(water + total_d_water, 0);
}

ECS.systems.select = function systemSelect (entities, delta) {
  for( var entityId in entities ){
        entity = entities[entityId];

    }
}



ECS.systems.userInput = function systemUserInput (entities, delta) {


}

ECS.systems.render = function systemRender (entities, delta) {
    for(var entityId in entities) {
        entity = entities[entityId];
        //Draw drone
        if (entity.components.type.value != "build"){
            img = entity.components.graphic.value;
            pos = entity.components.position.value;
            var screen_pos = screenPos(x_offset, y_offset, pos.x, pos.y, global_view);
            ct.fillStyle = 'rgb(0, 0, 0, 0.3)';
            ct.beginPath();
            ct.ellipse(screen_pos.x, screen_pos.y, tilewidth / 2, tilewidth / 4, 0, 0, Math.PI * 2);
            ct.fill();
            if (entity.components.height.value > water_level){
                ct.drawImage(img, screen_pos.x - tilewidth / 2, screen_pos.y - img.height - entity.components.height.value * height);
            }
        }
    }
}
