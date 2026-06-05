---
title: "React'te Anlık Saat"
description: "React uygulamalarında anlık saati göstermek için `requestAnimationFrame` kullanarak nasıl daha iyi bir yaklaşım benimseyebiliriz?"
date: "2024-08-17"
tags: ["react", "javascript", "requestanimationframe", "realtime", "clock"]
---

# Tik Tak: Anlık Saati React'te En İyi Nasıl Gösteririz?

Bir web uygulamasında anlık saati göstermek, kullanıcı deneyimi açısından önemli bir detaydır. React gibi modern bir kütüphane kullanırken, bunu en verimli ve pürüzsüz şekilde nasıl yapabiliriz? Bu yazıda, `requestAnimationFrame` kullanarak React'te gerçek zamanlı bir saat nasıl oluşturacağımızı adım adım inceleyeceğiz.

## Neden `setInterval` veya `setTimeout` Kullanmamalıyız?

Genellikle, belirli aralıklarla bir işlevi çağırmak için `setInterval` veya `setTimeout` kullanırız. Ancak, bu yöntemler, özellikle hızlı tempolu güncellemeler söz konusu olduğunda, bazı sınırlamalara sahiptir:

1. Zamanı %100 doğru gösteremeyebilir
2. Gereksiz yere kaynak tüketebilir.
3. Pürüzsüz ve akıcı bir deneyim sunmayabilir.

## `requestAnimationFrame` ile Daha İyi Bir Yaklaşım

`requestAnimationFrame`, tarayıcıya bir animasyon çerçevesi oluşturmadan önce belirtilen işlevi çağırmasını söyler. Bu, tarayıcının yenileme hızıyla senkronize olarak çalışır ve daha pürüzsüz, verimli güncellemeler sağlar.

İşte React bileşenimizde `requestAnimationFrame` kullanarak gerçek zamanlı bir saat oluşturmanın adımları:

1. Bileşenin state'inde `dateTime` adında bir değişken oluşturun ve başlangıç değerini `new Date()` olarak ayarlayın.

```jsx
const [dateTime, setDateTime] = useState(new Date());
```

2. `useEffect` hook'unu kullanarak, bileşen mount olduğunda `updateDateTime` fonksiyonunu çağırın. Bu fonksiyon, `dateTime` state'ini günceller ve `requestAnimationFrame` kullanarak kendisini yeniden çağırır.

```jsx
useEffect(() => {
  let animationFrameId;

  const updateDateTime = () => {
    setDateTime(new Date());
    animationFrameId = requestAnimationFrame(updateDateTime);
  };

  updateDateTime();

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  };
}, []);
```

3. JSX'te, `dateTime` state'ini kullanarak anlık saati render edin.

```jsx
<div>
  {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
</div>
```

Tüm bunları bir araya getiren kodun tamamı:

```jsx
import React, { useState, useEffect } from 'react';

function RealTimeClock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    let animationFrameId;

    const updateDateTime = () => {
      setDateTime(new Date());
      animationFrameId = requestAnimationFrame(updateDateTime);
    };

    updateDateTime();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div>
      {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </div>
  );
}

export default RealTimeClock;
```

Bu yaklaşım, saati her saniye güncellerken bile son derece pürüzsüz ve verimli bir şekilde çalışır. Tarayıcının yenileme hızıyla senkronize olduğu için, gereksiz güncellemelerden kaçınır ve kullanıcıya daha iyi bir deneyim sunar.

## Sonuç

React uygulamalarında anlık saati göstermek uygulamaya ayrı bir hava katar. `setInterval` veya `setTimeout` gibi geleneksel yöntemler yerine `requestAnimationFrame` kullanmak, daha pürüzsüz, verimli ve kullanıcı dostu bir deneyim sağlar. Bu makalede, `requestAnimationFrame` ile React'te gerçek zamanlı bir saat bileşeni oluşturmanın adımlarını gördük. Umarım bu tekniği kendi projelerinizde kullanabilir ve kullanıcılarınıza daha iyi bir deneyim sunabilirsiniz!
