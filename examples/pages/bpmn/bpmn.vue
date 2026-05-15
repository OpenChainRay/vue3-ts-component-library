<template>
  <a-card>
    bpmn
    <!-- <at-bpmn :processInstanceInfo="processInstanceInfo" :history="history" :formId="83867" processName='at_srm_pt_purchasecontract_v1'></at-bpmn> -->
    <at-bpmn :processInstanceInfo="processInstanceInfo" :history="history" :formId="11804"
      processName='at_srm_purchase_order_change_item_v1'></at-bpmn>

      <at-bpmn :processInstanceInfo="processInstanceInfo" :history="history" :formId="621579"
      processName='at_srm_purchase_item_v3'></at-bpmn>
  </a-card>
</template>

<script>
import { processInstanceInfo, history } from '@/services/nbmp'

export default {
  name: 'bpmn',
  components: {
    // ProTable
  },
  data() {
    return {
      processInstanceInfo,
      history
    }
  },

  async created() {

  },
  mounted() {

  },
  methods: {

  }

}

</script>
