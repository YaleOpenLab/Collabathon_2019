<template>
  <div>
    <Form/>
    <LineChart />
  </div>
</template>

<script>
import LineChart from '@/components/LineChart';
import Form from '@/components/Form';
export default {
  name: 'home',
  components: {
    LineChart,
    Form
  }
}
</script>
