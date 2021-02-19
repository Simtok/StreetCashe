<template>
  <div>
    <h2>Test</h2>
    <ul v-for="el in massiv" :key="el.value">
      <li>
        {{ el }}
        /
        {{ el.value }}
        --
        {{ el.prompt }}
      </li>
    </ul>
    <h1>{{ massiv['key1'].value }} - {{ massiv['key1'].prompt }}</h1>
    <v-text-field v-model="key" label="Key"></v-text-field>
    <v-btn @click="doIt(key)">Click</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      key: '',
      massiv: {
        key1: { value: 'key 1', prompt: 'p1' },
        key2: { value: 'key 2', prompt: 'p2' },
        key3: { value: 'key 3', prompt: 'p3' },
        key4: { value: 'key 4', prompt: 'p4' },
      },
    }
  },
  methods: {
    doIt(key) {
      if (key in this.massiv) {
        let v1 = this.massiv[key].value + 'Add more val'
        let p1 = this.massiv[key].prompt + 'Add more prompt'
        this.massiv[key].value = v1
        this.massiv[key].prompt = p1
      } else {
        // let val = 'Add new option'
        this.massiv[key] = { value: key + '  / value', prompt: key + '  /prompt' }
      }
      console.log(this.massiv)
    },
  },
}
</script>

<style lang="scss" scoped></style>
