
  // const params = { where: { id: { "$lt": 5 }}};

  streamApi.timedQuery("tq_all_sensorStream", "Sensor", 20, 0, {}, null, (sensorData) => {
    console.log("all sensors count:", sensorData.length);
    if (this.theTable) {
      theTable.destroy();
    }
    theTable = $("#sensor_table").DataTable({
      data: sensorData,
      columns: [ {data: 'id'}, {data: 'name'}, {data: 'value'} ]
    })
  });

