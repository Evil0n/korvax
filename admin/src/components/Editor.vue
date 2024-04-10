<template>
  <div>
    <h3>Это не будет сохраняться но покажется в макете в админке</h3>
    <div>картинка</div>
    <textarea cols="40" rows="5" style="margin-bottom: 15px" v-model="data.cardImageURL" />
    <div>заголовок</div>
    <textarea cols="40" rows="5" style="margin-bottom: 15px" v-model="data.cardTitle" />
    <div>текст</div>
    <textarea cols="40" rows="5" style="margin-bottom: 15px" v-model="data.cardText" />
    <hr>
    <h3>Это будет сохраняться</h3>
    <div>шаблон</div>
    <textarea cols="40" rows="5" style="margin-bottom: 15px" v-model="template" />
    <div>стили</div>
    <textarea cols="40" rows="5" style="margin-bottom: 15px" v-model="styles" />
    <br>
    <button @click="save">сохранить</button>
    <VueCard :data="data" :component="{ template, styles }" :loading="isLoading"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {VueCard} from "vue-card";

const defaultData = {
  cardTitle: "Cardino title",
  cardText: "Cardino text",
  cardImageURL: "https://images.placeholders.dev/?width=840&height=439&text=Cardino%20Header&bgColor=%23434343&textColor=%23dfdfde"
}
const template = ref(null)
const styles = ref(null)
const isLoading = ref(true)
const data = ref(defaultData)

const save = () => {
  fetch('http://localhost:3000/data', {
    method: 'POST', body: JSON.stringify({
      template: template.value || '',
      styles: styles.value || '',
    }),
    headers: {
      "Content-Type": "application/json",
    }
  })
}
onMounted(async () => {
  const response = await fetch('http://localhost:3000/template').then(res => res?.json());
  if (response?.template) {
    template.value = response.template;
  }
  if (response?.styles) {
    styles.value = response.styles;
  }

  isLoading.value = false
})
</script>
