package com.gonguelun.javanikocalendar.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.gonguelun.javanikocalendar.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ProyectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Proyect.class);
        Proyect proyect1 = new Proyect();
        proyect1.setId(1L);
        Proyect proyect2 = new Proyect();
        proyect2.setId(proyect1.getId());
        assertThat(proyect1).isEqualTo(proyect2);
        proyect2.setId(2L);
        assertThat(proyect1).isNotEqualTo(proyect2);
        proyect1.setId(null);
        assertThat(proyect1).isNotEqualTo(proyect2);
    }
}
