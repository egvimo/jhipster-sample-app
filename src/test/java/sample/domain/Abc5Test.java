package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc5Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc5.class);
        Abc5 abc51 = new Abc5();
        abc51.setId(1L);
        Abc5 abc52 = new Abc5();
        abc52.setId(abc51.getId());
        assertThat(abc51).isEqualTo(abc52);
        abc52.setId(2L);
        assertThat(abc51).isNotEqualTo(abc52);
        abc51.setId(null);
        assertThat(abc51).isNotEqualTo(abc52);
    }
}
