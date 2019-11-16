<template>
  <div>
    <FormData/>
    <LineChart />
  </div>
</template>

<script>
import LineChart from '@/components/LineChart';
import FormData from '@/components/FormData';
export default {
  name: 'home',
  components: {
    LineChart,
    FormData
  }
}
</script>
