<template>
  <div>
    <FormData v-on:updateData="onChangeData"/>
    <LineChart :dataChart="dataChart"/>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart';
import FormData from '@/components/FormData';
export default {
  name: 'home',
  data() {
    return {
      dataChart: [],
    }
  },
  components: {
    LineChart,
    FormData
  },
  methods: {
    onChangeData(val) {
      this.dataChart = val;
    }
  },
}
</script>
