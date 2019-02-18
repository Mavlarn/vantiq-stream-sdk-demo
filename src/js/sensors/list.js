
  // const params = { where: { id: { "$lt": 5 }}};

  // Avoid re-initialize when open this view second time.
if (typeof sensorListStream == undefined) {

  const sensorListStream = streamApi.timedQuery("tq_all_sensorStream", "Sensor", 20, 0, {}, null).subscribe(sensorData => {
    console.log("all sensors count:", sensorData.length);
    if (this.theTable) {
      theTable.destroy();
    }
    theTable = $("#sensor_table").DataTable({
      data: sensorData,
      columns: [ {data: 'id'}, {data: 'name'}, {data: 'value'} ]
    })
  });

  function unsubscribeAll() {
    sensorListStream.unsubscribe();
  }
}
