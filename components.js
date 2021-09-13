//Type of entity: building or mobile
ECS.Components.Type = function ComponentType (value){
    this.value = value;

    return this;
};
ECS.Components.Type.prototype.name = 'type';

//Grid size of building
ECS.Components.Size = function ComponentSize (value){
    this.y = Math.floor(value / 10);
    this.x = value % 10;

    return this;
};
ECS.Components.Size.prototype.name = 'size';

//Weight of building, cannot be build on unstable ground
ECS.Components.Weight = function ComponentWeight (value){
    this.value = value;

    return this;
};
ECS.Components.Weight.prototype.name = 'weight';

//Weight of building, cannot be build on unstable ground
ECS.Components.Consumption = function ComponentConsumption (value){
    this.value = value;

    return this;
};
ECS.Components.Consumption.prototype.name = 'consumption';

//Topleft corner tile of building
ECS.Components.Tile = function ComponentTile (value){
    this.value = value;
    return this;
};
ECS.Components.Tile.prototype.name = 'tile';

//Topleft corner tile of building
ECS.Components.Corners = function ComponentTile (value){
    this.value = value;
    return this;
};
ECS.Components.Corners.prototype.name = 'corners';

//Speed of a mobile unit
ECS.Components.Height = function ComponentHeight (value){
    this.value = value;

    return this;
};
ECS.Components.Height.prototype.name = 'height';

//Speed of a mobile unit
ECS.Components.Speed = function ComponentSpeed (value){
    this.value = value;

    return this;
};
ECS.Components.Speed.prototype.name = 'speed';

//Position of a mobile unit
ECS.Components.Position = function ComponentPosition (value){
    this.value = value;
    return this;
};
ECS.Components.Position.prototype.name = 'position';

//Position of a mobile unit
ECS.Components.Dest = function ComponentDest (value){
    this.value = value;
    return this;
};
ECS.Components.Dest.prototype.name = 'dest';

//Velocity of a mobile unit
ECS.Components.Velocity = function ComponentVelocity (value){
    this.value = value;
    return this;
};
ECS.Components.Velocity.prototype.name = 'velocity';

//The .png associated to a unit
ECS.Components.Graphic = function ComponentGraphic (img){
    this.value = img;
    return this;
};
ECS.Components.Graphic.prototype.name = 'graphic';

//Status of unit
ECS.Components.Status = function ComponentStatus (value){
    this.value = value || new Queue();
    return this;
};
ECS.Components.Status.prototype.name = 'status';
